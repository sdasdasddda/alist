'use strict'

import MixEnc from './mixEnc'
import Rc4Md5 from './rc4Md5'
import AesCTR from './aesCTR'

const cachePasswdOutward = {}

class FlowEnc {
  constructor(password, encryptType = 'mix', fileSize = 0) {
    fileSize *= 1
    let encryptFlow = null
    if (encryptType === 'mix') {
      console.log('@@mix', encryptType)
      encryptFlow = new MixEnc(password, fileSize)
      this.passwdOutward = encryptFlow.passwdOutward
    }
    if (encryptType === 'rc4') {
      console.log('@@rc4', encryptType, fileSize)
      encryptFlow = new Rc4Md5(password, fileSize)
      this.passwdOutward = encryptFlow.passwdOutward
    }
    if (encryptType === 'aesctr') {
      console.log('@@AesCTR', encryptType, fileSize)
      encryptFlow = new AesCTR(password, fileSize)
      this.passwdOutward = encryptFlow.passwdOutward
    }
    if (encryptType === null) {
      throw new Error('FlowEnc error')
    }
    cachePasswdOutward[password + encryptType] = this.passwdOutward
    this.encryptFlow = encryptFlow
    this.encryptType = encryptType
  }

  async setPosition(position) {
    await this.encryptFlow.setPositionAsync(position)
  }

  // 加密流转换
  encryptTransform() {
    return this.encryptFlow.encryptTransform()
  }

  decryptTransform() {
    return this.encryptFlow.decryptTransform()
  }
}

FlowEnc.getPassWdOutward = function (password, encryptType) {
  const passwdOutward = cachePasswdOutward[password + encryptType]
  if (passwdOutward) {
    return passwdOutward
  }
  const flowEnc = new FlowEnc(password, encryptType, 1)
  return flowEnc.passwdOutward
}

// const flowEnc = new FlowEnc('abc1234')
// const encode = flowEnc.encodeData('测试的明文加密1234￥%#')
// const decode = flowEnc.decodeData(encode)
// console.log('@@@decode', encode, decode.toString())
// console.log(new FlowEnc('e10adc3949ba56abbe5be95ff90a8636'))

export default FlowEnc
