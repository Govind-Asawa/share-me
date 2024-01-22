/*
    This trick allows better management of all the imports
    from the components folder.
    The effect of this can be seen in ../container/Home.jsx file
    Rather than importing each component separately, everything is
    combined in just a single line
*/

export { default as Sidebar } from './Sidebar';
export { default as UserProfile } from './UserProfile';
export { default as Login } from './Login';
export { default as Navbar } from './Navbar';
export { default as Feed } from './Feed';
export { default as PinDetail } from './PinDetail';
export { default as CreatePin } from './CreatePin';
export { default as Pin } from './Pin';
export { default as Search } from './Search';