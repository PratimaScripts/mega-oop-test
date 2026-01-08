import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {getBookViewingById} from "config/queries/bookViewing"
import { useLazyQuery } from "react-apollo";
import { Skeleton, Result } from "antd";
import BookViewingReceiverCard from "./BookViewingReceiverCard"
import BookViewingSenderCard from "./BookViewingSenderCard"
import { UserDataContext } from "store/contexts/UserContext";

import "./bookViewingDetail.scss";



const BookViewingDetail = () => {
    const { state: userDataState } = useContext(UserDataContext);
  const { userData } = userDataState;
    const { bookViewingId } = useParams()

    const [getBookViewing, { loading, error, data }] = useLazyQuery(getBookViewingById, {variables: {bookViewingId}})

    useEffect(() => {
      getBookViewing()
      //eslint-disable-next-line
    }, [])

    const bookViewing = data?.getBookViewingById?.data

    return loading || !bookViewing ? <Skeleton active /> : (
      !error ?  (bookViewing?.userId?._id === userData._id ?
        <BookViewingSenderCard
            key={bookViewing?._id}
            bookViewing={bookViewing}
            isOpen={true}
            getBookViewings={getBookViewing}/> :

        <BookViewingReceiverCard 
            key={bookViewing?._id} 
            bookViewing={bookViewing}
            isOpen={true} 
            getBookViewings={getBookViewing} />) :
        <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />)
}

export default BookViewingDetail;