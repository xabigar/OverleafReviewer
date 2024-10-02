
const OverleafManager = require('./overleaf/OverleafManager')

class ContentScript {
  constructor () {
    this._overleafManager = new OverleafManager()
    // todo
  }

  init () {
    this._overleafManager.init()
  }
}

const cs = new ContentScript()
cs.init()
