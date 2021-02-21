export const objects:any[] = [];

export const registerObject = (object:any) => {
    objects.push(object);
    return objects.length - 1;
}

export const lookupObject = (id:number) => {
    return objects[id];
}
