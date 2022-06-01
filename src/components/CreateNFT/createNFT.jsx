/* eslint-disable no-unused-vars */
import { message, Card, Input, Button } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";
import NativeBalance from "../NativeBalance";
import Address from "../Address/Address";
import Blockie from "../Blockie";

import ABI from "../../contracts/ABI.json";
const smartContractAddress = "0x32CCdC333a132BaA3a6467686f88dE934110c5a2";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    width: "450px",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    outline: "none",
    fontSize: "16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textverflow: "ellipsis",
    appearance: "textfield",
    color: "#041836",
    fontWeight: "700",
    border: "none",
    backgroundColor: "transparent",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textWrapper: { width: "100%", marginBottom: "2px" },
};

function CreateNFT() {
  const { saveFile } = useMoralisFile();
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const [nftName, setNftName] = useState("GeeGees");
  const [nftDescription, setNftDescription] = useState("We are awesome!!");
  const [personeTrait, setPersoneTrait] = useState("I am a Rockstar");
  const [nftLink, setNftLink] = useState("me.link");
  const [isPending, setIsPending] = useState(0);
  // const [nftImage, setNftImage] = useState("");

  async function create() {
    // save image to IPFS
    setIsPending(1);
    // const nftImage = document.getElementById("nftImage").files[0];
    // const imageHash = await saveFile("nftImage", nftImage, {
    //   saveIPFS: true,
    // }).then((res) => {
    //   console.log(res);
    //   return res;
    // });
    const imageHash =
      "https://ipfs.moralis.io:2053/ipfs/QmQq8TA5YELN95bDGBjGxGedYwZPxbBwFrJrysJ6jxCZVt/1.png";

    const metadata = {
      name: nftName,
      description: nftDescription,
      image: imageHash,
      attributes: [
        {
          trait_type: "link",
          value: document.getElementById("urlLink").value,
        },
        {
          trait_type: "username",
          value: personeTrait,
        },
      ],
    };
    console.log(metadata);
    // create NFT
    const metadataFile = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(metadata)),
    });

    await metadataFile.saveIPFS();
    const metadataHash = await metadataFile.ipfs();
    console.log(metadataHash);
    setIsPending(2);
    const options = {
      contractAddress: smartContractAddress,
      functionName: "createToken",
      abi: ABI,
      params: {
        tokenURI: metadataHash,
      },
    };
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => message.success("NFT created successfully"),
      onError: (error) => message.error(error),
    });
    setIsPending(0);
    setNftName("");
    setNftDescription("");
    // document.getElementById("nftImage").value = null;
    // const nft = await createNFT(metadataHash).then((res) => {
    //   console.log(res);
    //   return res;
    // });
  }

  return (
    <div>
      <Card
        style={styles.card}
        title={
          <div style={styles.header}>
            <Blockie scale={5} avatar currentWallet style />
            <Address size="6" copyable />
            <NativeBalance />
          </div>
        }
      >
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Create NFT</Text>
          </div>
          <select bgcolor="black" color="blue" name="urlLink" id="urlLink">
            <option color="blue" value="me.link">
              me.link
            </option>
            <option value="wagmi.link">wagmi.link</option>
            <option value="collector.link">collector.link</option>
            <option value="geegees.link">geegees.link</option>
          </select>
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Add in your personal trait</Text>
          </div>
          <Input
            size="large"
            // prefix={<CreditCardOutlined />}
            type="text"
            placeholder="I am a rockstar"
            value={personeTrait}
            onChange={(e) => setPersoneTrait(e.target.value)}
          />
        </div>
        {/* <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Upload NFT</Text>
          </div>
          <Input
            size="large"
            // prefix={<CreditCardOutlined />}
            type="file"
            placeholder="NFT Upload Media"
            id="nftImage"
          />
        </div> */}
        {/* <input type="file" placeholder="NFT Image" id="nftImage" /> */}
        {/* <button onClick={create}>Create NFT</button> */}
        {isPending === 0 ? (
          <Button
            type="primary"
            size="large"
            style={{ width: "100%", marginTop: "25px" }}
            onClick={create}
            // disabled={!tx}
          >
            Mint NFT ! 🎨
          </Button>
        ) : isPending === 1 ? (
          <Button
            type="primary"
            size="large"
            loading="true"
            style={{ width: "100%", marginTop: "25px" }}
            onClick={create}
            // disabled={!tx}
          >
            Uploading to IPFS 🖼️
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            loading="true"
            style={{ width: "100%", marginTop: "25px" }}
            onClick={create}
            // disabled={!tx}
          >
            Calling Elon Musk to mint your NFT 📞
          </Button>
        )}
      </Card>
    </div>
  );
}

export default CreateNFT;
