

export default function Newsbox(items){

    function teleport(to){
        window.open(to);
    }
    
    return (
        <div className="newsboxlay">

            <div className="newscontent" onClick={abc=>teleport(items.link)}>
                <div className="newsimg">
                    <img src={items.img} width="500px" height="320px"></img>
                </div>
                <div className="newsdetails">
                    <small>{new Date(items.date * 1000).toLocaleDateString() +  " " + new Date(items.date * 1000).toLocaleTimeString()}</small>
                    <h4>{items.title}</h4>
                    <p>{items.des}</p>
                    
                </div>
            </div>
        </div>
    )
}