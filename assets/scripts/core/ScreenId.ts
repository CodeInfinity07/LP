/**
 * Mirrors Unity's GameManager.GameState enum (Assets/Scripts/Managers/GameManager.cs),
 * with one deliberate fix: Match is reserved here from day one. Unity never added
 * GameMode4PlayerScene to GameState, so the one gameplay scene that existed was
 * never reachable through the app's own state machine.
 */
export enum ScreenId {
    Splash = 'Splash',
    AccountCenter = 'AccountCenter',
    Loading = 'Loading',
    Home = 'Home',
    Profile = 'Profile',
    Shop = 'Shop',
    Setting = 'Setting',
    Leaderboard = 'Leaderboard',
    Collection = 'Collection',
    SingleMatches = 'SingleMatches',
    Tournament = 'Tournament',
    VIPRoom = 'VIPRoom',
    Events = 'Events',
    Friends = 'Friends',
    Clubs = 'Clubs',
    ClubsMain = 'ClubsMain',
    Gifts = 'Gifts',
    Match = 'Match',
}
