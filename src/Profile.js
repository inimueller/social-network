import React from "react";
import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";
//I still want to render this!

export default function Profile(props) {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "40px",
                }}
            >
                <div id="profile-container">
                    <div id="profile">
                        <h1>{props.first}'s Profile</h1>
                        <div>
                            <ProfilePic
                                id="profile-pic"
                                imgUrl={props.imgUrl}
                            />
                        </div>

                        <h3>Tell us something about yourself:</h3>
                        <div id="bio-modal">
                            <div id="bio">
                                <BioEditor
                                    bio={props.bio}
                                    updateBio={(arg) => props.updateBio(arg)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
