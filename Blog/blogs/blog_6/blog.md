# Fizzgig

Thie is the start of the walkthrough of my password manager app (desktop) mentioned in the {#98c379}([previous blog](/blog/5)).  I will give a brief description of what the app does and then go straight into a more detailed description of the first major feature that was implemented for the app.  Some basic knowledge of rust is helpful.  I will try to provide helpful explanations or resources when rust specific knowledge is required.  

## What fizzgig does

Fizzgig is a password manager app akin to something like `1Password` or `LastPass`.  The main difference being that the app is completely offline first.  Meaning you won't be vulerable to data breaches like this {#98c379}([one](https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/)).  This comes caveats which we will get into as they come up.  Offline first means we need a way to store our passwords on the users device.  In this case on their desktop computer.  Tauri apps don't support mobile (yet).  In order to store pass words we need a way to read / write to the file system.

# A document database in rust

I am sure there are many solutions out there that provide a nice way to read and write to the file system, however I wanted to write my own.  You know... for funsies.  Besides what's the worst that could happen?  Only storing the most sensistive data a person has.  

## The document

The first primitive I need for a document database is well... the document.  The `document` abstraction needs to read / write data to the file system.  I also want to be able to encrypt that data, but I want to leave the encryption logic to the the user of the `document`.  You can view the whole document implementation {#98c379}([here](https://github.com/gabrielgrover/fizzgig/blob/main/document/src/document.rs)).  Let us first take a look at what data a document will hold.  In `rust` we reach for a `struct`.

```rust
pub struct Document<T> {
    label: String,
    uuid: String,
    data: T,
    ...
}
```
The above struct doesn't contain all of the fields that we will eventually need, but we will introduce the rest as they become relevant.  The `data` field is a generic type `T` that holds the data we want to store.  The fields `label` and `uuid` work as meta data so the saved document can be found in the file system.  Let's use an example to help explain.  Say we want to make documents that will save data about a user.  We first define a `User` struct

```rust
struct User {
    name: String,
    age: u8,
}
```


A user document could then be created like so

```rust
let label = "Users";
let user_doc = Document::<User>::new(label);
let user = User {
    name: "Duder",
    age: 21,
}

user_doc.update(user)
    .store()
    .await
    .unwrap();
```
What's happening here is a document struct is created with the call to `new`.  The `User` struct that is passed to the `update` call is held in memory until the call to `store` serializes the data and saves it to the file system.  

## Collecting documents

There is one more primitive I made to collect documents of the same lable and type `T`.  It is a struct called `LocalLedger`.  You can view the implementation {#98c379}([here](https://github.com/gabrielgrover/fizzgig/blob/main/local_ledger/src/ledger.rs)).  Here is how it is used.

```rust
struct Person {
    age: i32,
    name: String,
}

let ledger_label = "Contacts";
let super_secret_ledger_password = "Password1234".to_string();

let mut contact_ledger = LocalLedger::<Person>::new("Users", super_secret_ledger_password).unwrap();

let new_contact = Person {
    name: "duder".to_string(),
    age: 21,
};

contact_ledger.create(new_contact, "mother").unwrap();
```

A few things to unpack here.  First what are these {red}(`unwrap`) calls?  If you aren't familiar, `rust` uses the `errors as values` concept.  Anything that has a potential to fail returns a `Result` type.   For an in depth explanation of the `Result` type go {#98c379}([here](https://doc.rust-lang.org/rust-by-example/error/result.html)).  The reason why we a `Result` is used at `instantiation` (the `new` method call) is more interesting and has to do with how the `LocalLedger` encrypts the documents that are stored.  

## Encrypting documents

The `Document` struct has another storage method called `store_encrypted`.

```rust
pub fn store_encrypted<'a, F>(&'a mut self, encrypt: F) -> Result<&'a Self, LocalLedgerError>
where
    F: Fn(Vec<u8>) -> Result<Vec<u8>, LocalLedgerError>,
{
    let bytes = self.data_to_bytes()?;
    let encrypted_data = encrypt(bytes)?;

    self.encrypted_data = encrypted_data;
    self.encrypted = true;
    self.has_been_decrypted = false;
    self.do_store()
}
```

It is pretty close to the normal `store` method the only difference is the `encrypt` function argument that is used to encrypt the `Documents` data.  The `Document` struct employs a `bring your own encryption` model.  For us, the encryption of documents is handled in `LocalLedger`.  Here is the function it uses to encrypt documents.

```rust
fn encrypt_store_doc<T: Clone + Serialize + DeserializeOwned + Default + Debug>(
    doc: &mut Document<T>,
    key: &str,
) -> Result<(), LocalLedgerError> {
    doc.store_encrypted(|data| {
        let encryptor = age::Encryptor::with_user_passphrase(Secret::new(key.to_owned()));
        let mut encrypted_data = vec![];
        let mut writer = encryptor.wrap_output(&mut encrypted_data).map_err(|err| {
            LocalLedgerError::new(&format!("Failed to encrypt doc: {}", err.to_string()))
        })?;

        writer.write_all(&data).map_err(|err| {
            LocalLedgerError::new(&format!("Failed to encrypt doc: {}", err.to_string()))
        })?;

        writer.finish().map_err(|err| {
            LocalLedgerError::new(&format!("Failed to encrypt doc: {}", err.to_string()))
        })?;

        Ok(encrypted_data)
    })?;

    Ok(())
}
```

You can see the use of the `store_encrypted` method mentioned earlier.  The `encrypt` function argument defined here as a closure makes use the `age` crate to do a passphrase encryption.  You can view the crate {#98c379}([here](https://crates.io/crates/age)).

## Fin

This was light intro into some of the primitives I had to write to get a basic document store for the `fizzgig` app.  Next time we will go over how this is integrated into the `tauri` framework in order to trigger read / write to the document store from the client.  
