import type { SocialServiceContract } from "./types/social.contracts";
import { SocialRepository } from "./social.repository";


export const SocialService: SocialServiceContract = {
    async getFriends(userId) {
        return SocialRepository.getUserShortInfo(await SocialRepository.getFriends(userId))
    },
    async getRecomendations(userId, take) {
        return SocialRepository.getUserShortInfo(await SocialRepository.getRecomendations(userId, take))
    },
    async getRequests(userId) {
        return SocialRepository.getUserShortInfo(await SocialRepository.getRequests(userId))
    },
    async makeFriend(fromUserId, toUserId) {
        try {
            await SocialRepository.deleteRequest(fromUserId, toUserId)
        } catch{
            try {await SocialRepository.deleteRequest(toUserId, fromUserId)}
            catch{console.log("No request deleted??")}
        }
        await SocialRepository.makeFriend({firstUserId: fromUserId, secondUserId: toUserId, status: "friend"})  
    },
    async makeRequest(fromUserId, toUserId) {
        await SocialRepository.makeFriend({firstUserId: fromUserId, secondUserId: toUserId, status: "request"})  
    },
    async deleteFriend(userId, friendId) {
        await SocialRepository.deleteFriend(userId, friendId)
    },
    async deleteRequest(userId, requestId) {
        await SocialRepository.deleteRequest(userId, requestId)
    }
}