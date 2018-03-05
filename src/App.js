import React, { Component } from 'react'
import uuidv1 from 'uuid/v1'
import crypto from 'crypto-js'

const SECRET_KEY = '65f91800631a4717a563ec9e5403529ac1f8c8a74cb945cdbf029ce585726c09d9d3b2b5c3f64e6988810424573d0ed866fea87996e041f8aa9274d803a4e783e3dd93d25036423f948481915b572e1efb46a16a61b343e1813bf23a6b48eec70c481edfeef34be09cd6cb48cab1b37b8f8055a224b54fb1924bd54bfd168bbf'

const baseFields = {
  toSign: [
    ['access_key', 'fb839aacdf29389c9a6aca6fe2a7c5e3'],
    ['amount', 1000.00],
    ['currency', 'USD'],
    ['locale', 'en-GB'],
    ['profile_id', '21E2CF7B-E0A8-40D0-A2D4-2CD7EB5C5481'],
    ['reference_number', uuidv1()],
    ['transaction_type', 'sale,create_payment_token'],
    ['transaction_uuid', uuidv1()],
    ['bill_to_address_city', 'test'],
    ['bill_to_address_country', 'UK'],
    ['bill_to_address_line1', 'test'],
    ['bill_to_email', 'test@gmail.com'],
    ['bill_to_forename', 'John'],
    ['bill_to_surname', 'Doe']
  ],
  notToSign: []
}

class App extends Component {

  getFields = ({ toSign, notToSign }) => {
    toSign = [...toSign, ['signed_date_time', new Date().getTime()]]
    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, SECRET_KEY)
    const toHash = toSign.map(([name, value]) => `${name}=${value}`).join(',')
    const hashed = hmac.update(JSON.stringify(toHash)).finalize().toString(crypto.enc.Base64)
    return [
      ...toSign,
      ...notToSign,
      ['signature', hashed],
      ['signed_field_names', [...toSign.map(([name]) => name), 'signed_date_time'].join(',')],
      ['unsigned_field_names', [...notToSign.map(([name]) => name), 'signature', 'signed_field_names', 'unsigned_field_names'].join(',')],
    ]
  }

  render() {
    const fields = this.getFields(baseFields)
    console.log(fields)
    return (
      <form id="cybersource" method="POST" action=" https://testsecureacceptance.cybersource.com/pay">
        {fields.map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
        <button form="cybersource" type="submit">
          Pay
        </button>
      </form>
    )
  }
}

export default App
