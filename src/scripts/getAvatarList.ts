import HTTP from "../http";

export default async function getAvatarList(): Promise<Array<string>> {
    return await HTTP().get("/user/avatar/index")
        .then((res) => {
            return res.data.avatars;
        })
        .catch((error) => {
            console.error(error);
        })
}