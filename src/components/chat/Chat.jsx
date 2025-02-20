import React from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'

export default function Chat() {
    const [chosenEmoji, setChosenEmoji] = React.useState(false);
    const [text, setText] = React.useState('');

    const endRef = React.useRef(null);

    React.useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [text]);

    const handleEmojiClick = (emojiObject) => {
        setText((prev) => prev + emojiObject.emoji);
        setChosenEmoji(false);
    };

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>
                            John Doe
                        </span>
                        <p>
                            Online
                        </p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste obcaecati, recusandae eaque dolorem rem consequuntur nostrum perferendis sint provident laborum? Velit laborum consectetur quo assumenda laboriosam? Laborum animi et adipisci.
                        </span>
                        <p>
                            1 hour ago
                        </p>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae odit eius similique, nobis laboriosam assumenda vero, rem molestiae commodi molestias provident ea rerum reprehenderit qui voluptatem! Quam deserunt mollitia voluptatibus?
                        </p>
                        <span>
                            1 hour ago
                        </span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste dolorum eius veniam praesentium omnis facere nemo neque laudantium cumque ipsam odit autem molestias dicta, porro fugiat? Voluptatem odio dignissimos velit.
                        </span>
                        <p>
                            1 hour ago
                        </p>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Hi there!
                        </p>
                        <span>
                            1 hour ago
                        </span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste dolorum eius veniam praesentium omnis facere nemo neque laudantium cumque ipsam odit autem molestias dicta, porro fugiat? Voluptatem odio dignissimos velit.
                        </span>
                        <p>
                            1 hour ago
                        </p>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Hi there!
                        </p>
                        <span>
                            1 hour ago
                        </span>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder='Type a message' value={text} onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="emoji" onClick={() => setChosenEmoji(!chosenEmoji)} />
                    <div className="picker">
                        <EmojiPicker
                            open={chosenEmoji}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
                <button className='sendButton'>Send</button>
            </div>

        </div>
    )
}
