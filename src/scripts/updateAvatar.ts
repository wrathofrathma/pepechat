import HTTP from "../http";

export default async function updateAvatar(avatar: string) {
    await HTTP().patch("/user/avatar", {url: avatar})
        .catch((error) => {
            console.error(error);
        });
}