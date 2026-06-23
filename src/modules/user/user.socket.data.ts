import { UserSocketDataContract } from "./types/user.contracts";

export const UserSocketData: UserSocketDataContract = {
    // User connection map structure:
    // Key: Id of user, who is listened for updates
    // Value: Array of user ids, that are listening for updates of user with id of key
    userConnectionsMap: new Map(),
    // User connection map structure:
    // Key: Id of user, who is listening for updates
    // Value: Array of user ids, that are being listened for updates of user with id of key
    userListenerMap: new Map(),
}