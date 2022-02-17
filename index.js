const path = require("path");
const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const dbPath = path.join(home, '.todo')
const db = require("./db")
const inquirer = require("inquirer");

module.exports.add = async (title) => {
  const list = await db.read(dbPath)
  title.forEach((element) => {
    const task = {
      title: element,
      done: false
    }
    list.push(task)
  })
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

function markAsDone(list, index) {
  list[index].done = true
  void db.write(list)
}

function markAsUnDone(list, index) {
  list[index].done = false
  void db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "What is your new title?",
    default: list[index].title
  }).then((answer) => {
    list[index].title = answer.title
    void db.write(list)
  });
}


function remove(list, index) {
  list.splice(index, 1)
  void db.write(list)
}


function askForAction(list, index) {
  const actions = {
    markAsDone,
    markAsUnDone,
    updateTitle,
    remove
  }
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Please select an action',
      choices: [{name: 'quit', value: 'quit'},
        {name: 'mark as done', value: 'markAsDone'},
        {name: 'mark as undone', value: 'markAsUnDone'},
        {name: 'update title', value: 'updateTitle'},
        {name: 'remove', value: 'remove'}
      ]
    }).then((answer) => {
    const action = actions[answer.action]
    if (action) {
      action(list, index)
    }
  })
}


function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "What is your new task name?"
  }).then((answer) => {
    list.push({title: answer.title, done: false})
    void db.write(list)
  });
}

function printTasks(list) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: 'Please select the task you want to operate.',
      choices: [{name: 'quit', value: '-1'}, ...list.map((task, index) => {
        return {name: `${task.done ? '(*)' : '( )'} ${index + 1}.${task.title}`, value: index.toString()}
      }), {name: '+ create task', value: '-2'}],
    }).then((answer) => {
    const index = parseInt(answer.index)
    if (index >= 0) {
      askForAction(list, index)
    } else if (index === -2) {
      askForCreateTask(list)
    }
  });
}

module.exports.showAll = async () => {
  const list = await db.read(dbPath)
  printTasks(list)
}

