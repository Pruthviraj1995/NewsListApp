import React from 'react';

import './NewsList.scss';

const InfiniteScroll = (props) => {
   const endScroll = (e) => {
       if(e.target.offsetHeight + e.target.scrollTop >= (e.target.scrollHeight - 10 )){
        props.loadPages();
       }
   }
    return(
        <div className='infyScroll'
        onScroll={endScroll} ref={props.reference}> 
            {props.children}
        </div>
    )
}

export default InfiniteScroll;