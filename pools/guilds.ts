class GuildsPool extends Map<string, any[]> {
  set (username: string, guild: any[]) {
    super.set(username, guild)
    setTimeout(() => this.delete(username), 1000 * 60 * 3)

    return this
  }
}

export const guildsPool = new GuildsPool()
