import * as services from '../../helpers'

import { useCallback, useContext, useMemo } from "react"

import MailingServicesContext from "../../Provider/Context"

const useMailingServices = () => {
  const firebase = useContext(MailingServicesContext)

  const firestore = useMemo(() => firebase.firestore(), [firebase])

  const sendMail = useCallback((email, text) => 
    services.sendMail(firestore, email, text),
    [firestore]
  )

  return { sendMail }
}

export default useMailingServices