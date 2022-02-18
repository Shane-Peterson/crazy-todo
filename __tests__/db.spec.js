const db = require('../db.js')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
  afterEach(() => {
    fs.clearMocks()
  })
  it('can read', async () => {
    const data = [{title: "hi", done: true}]
    fs.setReadFileMock('xxx', null, JSON.stringify(data))
    const List = await db.read('xxx')
    expect(List).toStrictEqual(data)
  })
  it('can write', async () => {
    let fakeFile
    fs.setWriteFileMock('yyy', (path, data, callback) => {
      fakeFile = data
      callback(null)
    })
    const List = [{title: "hi", done: true}]
    await db.write(List, 'yyy')
    expect(fakeFile).toStrictEqual(JSON.stringify(List) + '\n')
  })
})