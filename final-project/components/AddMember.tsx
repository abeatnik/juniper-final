import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const AddMember: React.FC<{ boardId: string | null }> = ({ boardId }) => {
    const [showDialogue, setShowDialogue] = useState(false);
    const [copied, setCopied] = useState(false);
    const [invite, setInvite] = useState<string | null>(null);

    const togglePopup = () => {
        setShowDialogue(!showDialogue);
    };

    const onCopy = React.useCallback(() => {
        setCopied(true);
    }, []);

    const generateInvite = async () => {
        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boardId }),
            });
            const { id } = await res.json();
            setInvite(id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button id="add-member-button" onClick={togglePopup}>
                Add Member
            </button>
            {showDialogue && (
                <div className="nav-popup">
                    {!invite && (
                        <>
                            <button
                                className="nav-button"
                                onClick={togglePopup}
                            >
                                x
                            </button>
                            <button id="generate-code" onClick={generateInvite}>
                                generate invite code
                            </button>
                        </>
                    )}
                    {invite && (
                        <div className="input-group">
                            <button
                                className="nav-button"
                                onClick={togglePopup}
                            >
                                x
                            </button>
                            <label htmlFor="invite-code"></label>
                            <input
                                type="text"
                                name="invite-code"
                                value={invite}
                                readOnly
                            />
                            <CopyToClipboard onCopy={onCopy} text={invite}>
                                <button>Copy</button>
                            </CopyToClipboard>
                            {copied && <span> Copied.</span>}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AddMember;
