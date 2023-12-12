


const CommentHistory = ({ loggedInUserId, data }) => {
    return (
        <>
            <table className="table table-borderless">
                <thead>
                    <tr className="table-primary">
                        <td>Comment history</td>
                    </tr>
                </thead>
                <tbody>
                    {data.comment.map((comments, index) => (
                        <tr key={index}>
                            {comments.senderId === loggedInUserId && (
                                <>
                                    <td></td>
                                    <td
                                        style={{
                                            textAlign: 'left',
                                            width: '50%', 
                                            whiteSpace: 'pre-wrap',
                                            overflowWrap: 'break-word', 
                                        }}
                                    >
                                        <p className="rounded-3 shadow-sm mx-2" style={{ backgroundColor: "#4c97ff" }}><span className="mx-2">{comments.content}</span></p>
                                    </td>
                                </>
                            )}
                            {comments.senderId === loggedInUserId && (
                                <td
                                    colSpan={2}
                                    style={{
                                        textAlign: 'left',
                                        width: '50%', // Set your desired max width
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word', // Add this line
                                    }}
                                >
                                    <p className="" style={{ fontSize: '1em', fontWeight: 'bold' }}>{comments.content}</p>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}


export default CommentHistory;