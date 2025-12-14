import { useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "@/hooks/useStore";
import minGraphicsQuality from "@/util/minGraphicsQuality";

export default function FourFrogsSettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Controls')

    const darkMode = useStore(state => state.darkMode)
    const toggleDarkMode = useStore(state => state.toggleDarkMode)

    const toontownMode = useStore(state => state.toggleToontownMode)
    const toggleToontownMode = useStore(state => state.toggleToontownMode)

    const toggleAudioEnabled = useStore((state) => state.toggleAudioEnabled)
    const audioSettings = useStore((state) => state.audioSettings)
    const setAudioSettings = useStore((state) => state.setAudioSettings)
    const audioEnabled = useStore((state) => state.audioSettings.enabled)

    const graphicsQuality = useStore((state) => state.graphicsQuality)
    const setGraphicsQuality = useStore((state) => state.setGraphicsQuality)

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                // centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Controls',
                            'Visuals',
                            'Audio',
                            'Chat'
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">
                        {tab == 'Visuals' &&
                            <div>

                                <div className="p-2">
                                    <div>Graphics Quality</div>
                                    {[
                                        'Low',
                                        'Medium',
                                        'High'
                                    ].map((item, item_i) =>
                                        <ArticlesButton
                                            key={item_i}
                                            active={item == graphicsQuality}
                                            onClick={() => {
                                                setGraphicsQuality(item)
                                            }}
                                        >
                                            {item}
                                        </ArticlesButton>
                                    )}
                                </div>

                                <div className="p-2">
                                    <div>Dark Mode</div>
                                    <ArticlesButton
                                        onClick={() => { toggleDarkMode() }}
                                    >
                                        {darkMode ? 'Enabled' : 'Disabled'}
                                    </ArticlesButton>
                                </div>

                                <div className="p-2">
                                    <div>Toontown Mode</div>
                                    <ArticlesButton
                                        onClick={() => { toggleToontownMode() }}
                                    >
                                        {toontownMode ? 'Enabled' : 'Disabled'}
                                    </ArticlesButton>
                                </div>

                            </div>
                        }
                        {tab == 'Controls' &&
                            <div>
                                {[
                                    {
                                        action: 'Move Up',
                                        defaultKeyboardKey: 'W'
                                    },
                                    {
                                        action: 'Move Down',
                                        defaultKeyboardKey: 'S'
                                    },
                                    {
                                        action: 'Move Left',
                                        defaultKeyboardKey: 'A'
                                    },
                                    {
                                        action: 'Move Right',
                                        defaultKeyboardKey: 'D'
                                    },
                                    {
                                        action: 'Move Up',
                                        defaultKeyboardKey: 'Up Arrow'
                                    },
                                    {
                                        action: 'Move Down',
                                        defaultKeyboardKey: 'Down Arrow'
                                    },
                                    {
                                        action: 'Move Left',
                                        defaultKeyboardKey: 'Left Arrow'
                                    },
                                    {
                                        action: 'Move Right',
                                        defaultKeyboardKey: 'Right Arrow'
                                    },
                                    {
                                        action: 'Fire Cannon',
                                        defaultKeyboardKey: 'Space'
                                    },
                                ].map((obj, obj_i) =>
                                    <div key={`${obj.action}-${obj_i}`}>
                                        <div className="flex-header border-bottom pb-1 mb-1">

                                            <div>
                                                <div>{obj.action}</div>
                                                {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                            </div>

                                            <div>

                                                <div className="badge bg-black badge-hover border bg-articles me-1">{obj.defaultKeyboardKey}</div>

                                                {/* TODO - Add back in - use Race Game logic for this, finished implementation */}
                                                <ArticlesButton
                                                    className=""
                                                    small
                                                    disabled
                                                >
                                                    Change Key
                                                </ArticlesButton>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        {tab == 'Audio' &&
                            <>

                                <div className="p-2">
                                    <div>Music</div>
                                    <ArticlesButton
                                        onClick={() => { toggleAudioEnabled() }}
                                    >
                                        {audioEnabled ? 'Enabled' : 'Disabled'}
                                    </ArticlesButton>
                                </div>

                                <div className="p-2">
                                    <Form.Label className="mb-0">Game Volume</Form.Label>
                                    <Form.Range
                                        value={audioSettings.soundEffectsVolume}
                                        onChange={(e) => setAudioSettings({
                                            ...audioSettings,
                                            soundEffectsVolume: e.target.value
                                        })}
                                    />
                                </div>

                                <div className="p-2">
                                    <Form.Label className="mb-0">Music Volume</Form.Label>
                                    <Form.Range
                                        value={audioSettings.backgroundMusicVolume}
                                        onChange={(e) => setAudioSettings({
                                            ...audioSettings,
                                            backgroundMusicVolume: e.target.value
                                        })}
                                    />
                                </div>
                            </>
                        }
                        {tab == 'Chat' &&
                            <div className="p-1">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat panel"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Censor chat"
                                />
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Game chat speech bubbles"
                                />
                            </div>
                        }
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}


                    <div>

                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            variant="outline-danger ms-3"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>
        </>
    )

}