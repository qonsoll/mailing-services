import MailingServicesContext from './Context'

const Provider = (props) => {
  const { firebase, ...rest } = props

  return <MailingServicesContext.Provider value={firebase} {...rest} />
}

export default Provider