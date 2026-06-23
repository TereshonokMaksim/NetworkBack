import { ChatSocketDataContract } from "./types/chat.contracts";


export const ChatSocketData: ChatSocketDataContract = {
    // Group Id: Set([memberId1, memberId2...])
    groupMembersListened: new Map(),
    // Member Id: Set([groupId1, groupId2...])
    groupListeners: new Map()
}