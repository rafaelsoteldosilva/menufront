export function checkResponseStatus(response) {
    let myResponse = Number(response);
    if (response !== undefined && myResponse >= 200 && myResponse < 400)
        return true;
    else return false;
}

// good
