'use strict';

const Express = require("express")
const Discord = require("discord.js")
const ROBLOX = require("noblox.js")
const FS = require("fs")
const Settings = require("./settings.json")

const ServerBot = new Discord.Client()
const ManagedGuildId = "151403861905506304"
const RoleId = "214981841017372672"
let ManagedGuild

let ServerRoutes = Express.Router()
ServerRoutes.get(
    "/getBanned",
    (request, response) => {
        response.status(200).send(JSON.stringify(JSON.parse(FS.readFileSync("./banned.json"))))
    }
)
// ServerRoutes.get(
//     "/banUser/:requestingUser/:toBan",
//     (request, response) => {
//         ROBLOX.getUsernameFromId
//     }
// )
ServerRoutes.get(
    "/isAuthorized/:userId",
    (request, response) => {
        // Get Discord Member by their Nickname, make sure they have the Bleu Pig role, and return
        // a response
        ROBLOX.getUsernameFromId(request.params.userId)
            .then(
                (userId) => {
                    const User = ManagedGuild.members.find(member => member.nickname === userId)
                    if (User === null) {
                        response.status(200).send(
                            JSON.stringify(
                                {
                                    authorized: false,
                                    reason: "\nYou are not in the Discord.\nPlease visit our Twitter @BleuPigs to learn more."
                                }
                            )
                        )
                    } else {
                        const HasRole = User.roles.find((role) => role.id === RoleId)
                        if (HasRole === null) {
                            response.status(200).send(
                                JSON.stringify(
                                    {
                                        authorized: false,
                                        reason: "\nYou are not authorized to join."
                                    }
                                )
                            )
                        } else {
                            response.status(200).send(
                                JSON.stringify(
                                    {
                                        authorized: true
                                    }
                                )
                            )
                        }
                    }
                }
            ).catch(
                (err) => {
                    response.status(200).send(
                        JSON.stringify(
                            {
                                authorized: false,
                                reason: "\nUser does not exist"
                            }
                        )
                    )
                }
            )
    }
)

ServerBot.on(
    "ready",
    () => {
        ManagedGuild = ServerBot.guilds.get(ManagedGuildId)
        if (ManagedGuild === null) {
            console.error("failed to find Guild")
        } else {
            ServerApp.listen(8080)
            //ROBLOX.cookieLogin(Settings.robloxCookie)
            console.log("server ready")
        }
    }
)


let ServerApp = Express()
ServerApp.use(ServerRoutes)
ServerBot.login(Settings.discordToken)
