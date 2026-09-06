import { Store } from './Store';

/**
 * Mirrors ClubDetailsModel.ClubData (Assets/Scripts/Models/ClubDetailsModel.cs)
 * field-for-field - it's the server's actual response shape.
 *
 * Unity wrapped this in ClubDetailsModel.Root -> List<ClubDetailsWrapper> ->
 * ClubData only because JsonUtility.FromJson needs a root object, so
 * SocketManager.cs manually string-concatenated the raw payload into
 * "{ \"club_details\": " + raw + " }" before parsing, then every consumer
 * (see ClubDataEvent.GetFirstClub()) immediately unwrapped it back down to a
 * single ClubData anyway. JSON.parse doesn't need a root wrapper, so
 * SocketService parses straight to this flat shape and nothing downstream
 * has to know the wrapping ever existed.
 */
export interface ClubDetails {
    clubCode: string;
    clubName: string;
    clubPicture: string;
    clubFlag: string;
    announcement: string;
    _id: string;
    createdAt: string;
    __v: number;
}

/** Replaces Assets/Scripts/Static/ClubDataEvent.cs. */
export const ClubStore = new Store<ClubDetails>();
