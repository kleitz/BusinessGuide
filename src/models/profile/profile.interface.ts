import { FirebaseListObservable } from 'angularfire2/database';


export interface Profile {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    friends: FirebaseListObservable<Profile[]>;
    id:string;
    //friends: Map<string,Profile>;
}