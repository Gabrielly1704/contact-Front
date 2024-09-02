import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiUserCirclePlus } from "react-icons/pi";
import { Contact } from "../dto/ContactDTO";
import "../index.css";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [AddFormContact, setAddFormContact] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    adress: "",
  });

  useEffect(() => {
    fetch("http://localhost:3333/contact")
      .then((response) => response.json())
      .then((data) => setContacts(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddContactClick = () => {
    setAddFormContact(true);
  };

  const handleAddButtonClick = () => {
    const { phone, adress, ...rest } = formData;

    const contactToAdd = {
      ...rest,
      phone: parseInt(phone),
      adress: parseInt(adress),
    };

    fetch("http://localhost:3333/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactToAdd),
    }).then((response) => {
      if (response.ok) {
        console.log("Novo contato adicionado com sucesso!");
        fetch("http://localhost:3333/contact")
          .then((response) => response.json())
          .then((data) => {
            setContacts(data);
            setAddFormContact(false);
            setFormData({
              name: "",
              phone: "",
              email: "",
              adress: "",
            });
          });
      } else {
        console.error("Erro ao adicionar novo contato:", response.statusText);
      }
    });
  };

  return (
    <div className="container">
      <h1>Gerenciamento de Contatos</h1>
      <h3>Lista de contatos existentes</h3>
      {contacts.map((contact) => (
        <Link key={contact.id} to={`/detail/${contact.id}`}>
          <h2>{contact.name}</h2>
        </Link>
      ))}
      {AddFormContact ? (
        <div className="add-contact-form">
          <div className="input-add-contact">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="adress"
              placeholder="Endereço"
              value={formData.adress}
              onChange={handleChange}
            />
          </div>
          <div className="btn-add-form">
            <button onClick={handleAddButtonClick}>Adicionar</button>
          </div>
        </div>
      ) : (
        <div className="btn-add-container">
          <button className="btn-add" onClick={handleAddContactClick}>
            <PiUserCirclePlus />
            Adicionar contato
          </button>
        </div>
      )}
    </div>
  );
}
