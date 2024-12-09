import * as openpgp from "npm:openpgp";

async function createKeyPair(id: number) {
    const keys = await openpgp.generateKey({
        userIDs: { name: id.toString() },
    });

    const privateKey = await openpgp.readPrivateKey({
        armoredKey: keys.privateKey,
    });
    const publicKey = await openpgp.readKey({ armoredKey: keys.publicKey });

    return { privateKey, publicKey };
}

async function encryptMessage(publicKey: openpgp.Key, text: string) {
    return await openpgp.createMessage({
        text,
        format: "binary",
    }).then((message) =>
        openpgp.encrypt({
            message,
            encryptionKeys: publicKey,
            format: "armored",
        })
    ).then((message) => openpgp.readMessage({ armoredMessage: message }));
}

async function decryptMessage<T>(
    privateKey: openpgp.PrivateKey,
    message: openpgp.Message<T>,
): Promise<T> {
    const { data } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
    });
    return data;
}

async function connect() {
    const id = Math.floor(Math.random() * (2 ** 24));
    const socket = new WebSocket("ws://127.0.0.1:8000");
    const { privateKey, publicKey } = await createKeyPair(id);

    const message = await encryptMessage(publicKey, "hello world!");
    const decrypted = await decryptMessage(privateKey, message);
    console.log(decrypted);

    socket.addEventListener("open", () => {
    });
}

function main() {
    connect();
}

main();
