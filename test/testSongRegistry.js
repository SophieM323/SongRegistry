// import the contract artifact
const SongRegistry = artifacts.require('./SongRegistry.sol')

// test starts here
contract('SongRegistry', function (accounts) {
    // predefine the contract instance
    let SongRegistryInstance
  
    // before each test, create a new contract instance
    beforeEach(async function () {
      SongRegistryInstance = await SongRegistry.new()
    })

    // first test:
    it('should check if a song is correctly added to the registry', async function () {
      await SongRegistryInstance.register("Cool Song", "example.com", 1, {'from': accounts[0] })
      let song = await SongRegistryInstance.songs(0)
      assert.equal(song.title, "Cool Song", 'Title has not been set correctly.')
      assert.equal(song.owner, accounts[0], 'Owner is not account 0')
    })

    // second test:
    it('should check if a song can be bought', async function () {
      await SongRegistryInstance.register("Real Song", "realsong.com", 1, {'from':accounts[0] })
      await SongRegistryInstance.buy(0, {'from': accounts[1], 'value': 1})
      //check if a song can be bought by buyer (account 1)
      let boughtsong = await SongRegistryInstance.isBuyer(0, {'from': accounts[1] })
      assert.equal(boughtsong, true, 'Account 1 can not buy Real Song')
    })

     // third test:
     it('should check that the number of songs increases with a new registration', async function () {
      // first song registration
      await SongRegistryInstance.register('One Song', 'onesong.com', 1, {'from': accounts[0] })
      let songcount = await SongRegistryInstance.numberOfSongs()
      assert.equal(songcount, 1, 'number of songs is not equal to 1 registered song')
      // second song registration after first song is registered
      await SongRegistryInstance.register('Another Song', 'anothersong.com', 1, {'from': accounts[0] })
      songcount = await SongRegistryInstance.numberOfSongs()
      assert.equal(songcount, 2, 'number of songs is not equal to 2 registered song')
    })

     // fourth test:
     it('should check that only a true buyer is identified as such', async function () {
       await SongRegistryInstance.register('True Song', 'truesong.com', 1, {'from': accounts[0] })
       await SongRegistryInstance.buy(0, {'from':accounts[1], 'value':1 })
       // check whether buyer (account) 1 is a registered buyer
       let buyer1 = await SongRegistryInstance.isBuyer(0, {'from': accounts[1] })
      assert.equal(buyer1, true, 'Buyer (Account) 1 is not a registered buyer')
    })
  })