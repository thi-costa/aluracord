import { Box, Text } from "@skynexui/components";
import appConfig from "../config.json";

export default function ChatPage() {
    return (
        <>
            <Box
                styleSheet={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    width: "100%",
                    borderRadius: "5px",
                    padding: "0 0 0 0",
                    margin: "16px",
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                }}
            >
                <Text
                    variant="body1"
                    styleSheet={{
                        marginBottom: "0px",
                        textAlign: "center",
                        color: appConfig.theme.colors.neutrals[300],
                    }}
                >
                    404 Não conseguimos achar a página que você
                    busca
                </Text>
            </Box>
        </>
    );
}
