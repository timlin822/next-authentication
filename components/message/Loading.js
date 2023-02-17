import {FaSpinner} from 'react-icons/fa'

const Loading=()=>{
    return (
        <div className="bg-loading">
            <FaSpinner className="loading-icon" />
        </div>
    )
}

export default Loading