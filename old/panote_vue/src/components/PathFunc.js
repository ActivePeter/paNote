const PathChangeType={
    Add:0,
    Delete:1,
    MoveSome:2,
}
export class PathChange{
    type=-1
    before=null
    after=null
    constructor(type,before,after) {
        this.type=type
        this.before=before
        this.after=after
    }
}
export default {
    PathChange,
    PathChangeType
}