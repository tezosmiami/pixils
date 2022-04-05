import { useEffect, useState, createContext, useContext} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

const hicdex ='https://hdapi.teztools.io/v1/graphql'

const querySubjkt = `
query Subjkt($address: String!) {
  hic_et_nunc_holder(where: {address: {_eq: $address}}) {
    name
  }
}
`

async function fetchGraphQL(queryObjkts, name, variables) {
  let result = await fetch(hicdex, {
    method: 'POST',
    body: JSON.stringify({
      query: queryObjkts,
      variables: variables,
      operationName: name,
    }),
  })
  return await result.json()
}

const UserContext = createContext();
const options = {
  name: 'Tezos Miami'
 };
  
const wallet = new BeaconWallet(options);

export const useUserContext = () => {

  const app = useContext(UserContext);
  if (!app) {
    throw new Error(
      `!app`
    );
  }
  return app;
};

export const UserContextProvider = ({ children }) => {
  
  const [app, setApp] = useState("");
  const [address, setAddress] = useState("");
  const [tezos, setTezos] = useState(new TezosToolkit("https://mainnet.api.tez.ie"));
  const [activeAccount, setActiveAccount] = useState("");
  const [name, setName] = useState("")

  useEffect(() => {
     const getLoggedIn = async () => {
        if (await wallet?.client?.getActiveAccount()) { 
          setActiveAccount(await wallet?.client?.getActiveAccount());
          const address =  await wallet.getPKH();
          setAddress(address);
          tezos.setWalletProvider(wallet);
          setTezos(tezos)
          if(address) {
            const { errors, data } = await fetchGraphQL(querySubjkt, 'Subjkt', { address: address});
           if (errors) {
             console.error(errors);
           }
           data?.hic_et_nunc_holder[0]?.name && 
           setName(data.hic_et_nunc_holder[0].name);
          }
      }
    };
      getLoggedIn();
    }, [tezos]);
  
  async function logIn() {
    app.currentUser && await app.currentUser?.logOut();
    await wallet.client.clearActiveAccount();
    await wallet.client.requestPermissions({
      network: {
        type: 'mainnet',
      },
    });
    tezos.setWalletProvider(wallet);
    setTezos(tezos)
    let address=await wallet.getPKH()
    setAddress(address);
    setActiveAccount(await wallet?.client?.getActiveAccount());
    if(address) {
        const { errors, data } = await fetchGraphQL(querySubjkt, 'Subjkt', { address: address});
     if (errors) {
       console.error(errors);
     }
     if(data?.hic_et_nunc_holder[0]?.name) {
        setName(data.hic_et_nunc_holder[0].name);
      }
    }
   
  }

  async function logOut() {
    await wallet.client.clearActiveAccount();
    setActiveAccount("")
    setAddress("");
    setName("")
    //  window.location.reload();
  }

  const wrapped = { ...app, tezos, logIn, logOut, activeAccount, address, name};

  return (
   
    <UserContext.Provider value={wrapped}>
           {children}
    </UserContext.Provider>
  
  );
};

export default UserContextProvider;