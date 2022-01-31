import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import securityConfig from "../security.json";

// Keys e URLs do seu BD
const SUPABASE_ANON_KEY = securityConfig.SUPABASE_ANON_KEY;
const SUPABASE_URL = securityConfig.SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenerMessage(addMessage) {
    return supabaseClient
        .from("messages")
        .on("INSERT", (liveResponse) => {
            addMessage(liveResponse.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const [message, setMessage] = React.useState("");
    const [messagesList, setMessagesList] = React.useState([]);

    const router = useRouter();
    const userLogged = router.query.username;

    React.useEffect(() => {
        // Por padrão roda sempre que se atualiza
        const supabaseData = supabaseClient
            .from("messages")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                // console.log("Dados da consulta:", data);
                setMessagesList(data);
            });

        const subscription = listenerMessage((newMessage) => {
            console.log("New message: ", newMessage);
            console.log("Lista de mensagens: ", messagesList);

            setMessagesList((actualList) => {
                console.log("valor atual da lista: ", actualList);
                return [newMessage, ...actualList];
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            from: userLogged,
            text: newMessage,
        };

        supabaseClient
            .from("messages")
            .insert([message])
            .then(({ data }) => {
                console.log("Creating message", data);
            });
        setMessage("");
    }

    /* const deleteItem = (index) => {
        this.setState("tours", [].concat(tours).splice(index, 1));
    }; */
    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://wallpapers.com/images/high/classic-batman-logo-7d945brkjqdfw37h.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],

                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        backgroundImage: `url(https://wallpapers.com/images/high/classic-batman-logo-7d945brkjqdfw37h.jpg)`,
                        backgroundSize: "cover",
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    <MessageList messages={messagesList} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();

                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        {/* CallBack */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                handleNewMessage(":sticker: " + sticker);
                            }}
                        />

                        <Button
                            buttonColors={{
                                contrastColor: "#FFFFFF",
                                mainColor: "#06FF00",
                                mainColorLight: "#CEE5D0",
                                mainColorStrong: "#95CD41",
                            }}
                            styleSheet={{
                                margin: "5px",
                            }}
                            label="Send"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleNewMessage(message)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {
    //console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong">{message.from}</Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date().toLocaleDateString()}
                            </Text>
                            <Button
                                buttonColors={{
                                    contrastColor: "#FFFFFF",
                                    mainColor: "#DA1212",
                                    mainColorLight: "#FF6464",
                                    mainColorStrong: "#AB4E19",
                                }}
                                label="Delete"
                                size="sm"
                                variant="secondary"
                                onClick={async() => {
                                    await supabaseClient
                                        .from("messages")
                                        .delete()
                                        .match({ id: message.id });
                                }}
                            />
                        </Box>
                        {message.text.startsWith(":sticker:") ? (
                            <Image
                                src={message.text.replace(":sticker:", "")}
                            />
                        ) : (
                            message.text
                        )}
                    </Text>
                );
            })}
        </Box>
    );
}
