

export const formatDate=(date)=>{
    const day=date.getDate();
    const month=date.toLocaleString('default',{month:'long'})
    const year=date.getFullYear();
    const formattedDate=`${day} ${month} ${year}`
    return formattedDate;
}


export const formatMongoDate = (mongoDate) => {
    const date = new Date(mongoDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
};
