function friendRecommendations(network, user) {
    let recofriend = new Set();
    let visited = [user, ...network[user]];
    let queue = [...network[user]];

    while (queue.length>0){
        const now = queue.shift();

        for (const friend of network[now]){
            if (!visited.includes(friend)){
                recofriend.add(friend);
                queue.push(friend);
                visited.push(friend);
            }
        }
    }
    return Array.from(recofriend);
}
