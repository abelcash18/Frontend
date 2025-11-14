import './list.scss'
import Card from "../card/Card"

function List({ posts = [], onEdit, onDelete, showActions = false }) {
    return (
        <div className='list'>
            {posts.map(item => (
                <Card 
                    key={item._id || item.id} 
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showActions={showActions}
                />
            ))}
        </div>
    )
}

export default List