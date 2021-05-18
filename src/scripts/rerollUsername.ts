import HTTP from "../http";

export default async function () {

    await HTTP().post("/user/username/reroll")
        .catch((error) => {
            console.error(error);
        });
}