import daggy from 'daggy'

const RemoteDataInt = daggy.taggedSum('RemoteData', {
    NotAsked: [],
    Loading: [],
    Failed: ['error'],
    Updated: ['data'],
    Succeeded: ['data'],
})

RemoteDataInt.prototype.map = function (f) {
    return this.cata({
        NotAsked: () => this,
        Loading: () => this,
        Failed: () => this,
        Succeeded: data => RemoteDataInt.Succeeded(f(data)),
    })
}

RemoteDataInt.prototype.successOr = function (v) {
    return this.cata({
        NotAsked: () => v,
        Loading: () => v,
        Failed: () => v,
        Succeeded: data => data,
    })
}

export const RemoteData = RemoteDataInt //eslint-disable-line