Follow the steps below to download, install, and run this project.

## Dependencies
Install these prerequisites to follow along with the tutorial. See free video tutorial or a full explanation of each prerequisite.
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/



##Step 1. Extract and download the project folder.
## Step 2. Install dependencies

## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance. 


## Step 4. Compile & Deploy  Smart Contract
`$ truffle compile
`$ truffle migrate --reset`
You must migrate the smart contract each time your restart ganache.

## Step 5. Configure Metamask
- Unlock Metamask
- Connect metamask to your local Etherum blockchain provided by Ganache.
- Import an account provided by ganache.

## Step 6. Run the Front End Application
`$ npm run dev`
Visit this URL in your browser: http://localhost:3000

For Deep Learning:

1.Download IPFS
2.Run your model using the private dataset you have  and save it as .h file which contains knowledge gained from your private dataset
3.Upload the .h file to the IPFS server to get the CID (hash) 
4.Now upload this hash as a model to the block chain.
5.You can now use these hashes to get the .h files(models) to train with other set of data.





