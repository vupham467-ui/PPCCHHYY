import { Timeline } from 'primereact/timeline';
import React from 'react';

const customizedMarker = (event) => {
    const hasTime = !!event.date;
    return (
        <span
            className={`p-timeline-event-marker border-5 ${hasTime ? "border-green-800" : ""
                }`}
            style={{
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        ></span>
    );
};

const SignatureTimeLine = ({ ...props }) => {

    const titile = props?.title || "Tiến trình ký số";
    const events = props?.events;
    const formatSignDate = props?.formatSignDate;

    return (
        <div className="progress mt-4">
            <h5>{titile}</h5>
            <div className="time-line">
                <Timeline
                    marker={customizedMarker}
                    value={events}
                    opposite={(item) => item.status}
                    content={(item) => {
                        const avatarUrl = item?.avatarUrl || "";
                        return (
                            <div className="flex flex-row gap-2 align-items-center">
                                 
                                <div className='flex align-items-center justify-content-center'>
                                    {avatarUrl && (
                                        <img src={avatarUrl} alt=""
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                aspectRatio: 1 / 1,
                                                border: '1px solid #ccc',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    {!avatarUrl && (
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                border: '1px solid #ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <i className="pi pi-user" style={{ fontSize: '15px' }}></i>
                                        </div>
                                    )}
                                </div>
                            
                                <div>
                                    <small className="text-color-secondary">{item.user}</small>
                                    <br></br>
                                    <small className="text-color-secondary">
                                        {formatSignDate(item?.date)}
                                    </small>
                                </div>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    )
};



export default SignatureTimeLine;
