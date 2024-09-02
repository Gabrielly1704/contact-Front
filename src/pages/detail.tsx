import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Contact } from "../dto/ContactDTO";
import { BiTrash } from "react-icons/bi";
import { PiPenBold } from "react-icons/pi";
import "../index.css";

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact>({} as Contact);
  const [updatedMode, setUpdatedMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    adress: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3333/contact/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const { name, phone, email, adress } = data;
        setContact({
          id: data.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          adress: data.adress,
        });
        setFormData({
          name,
          phone: data.phone.toString(),
          email,
          adress: data.address.toString(),
        });
      });
  }, [id]);

  const handleEditClick = () => {
    setUpdatedMode(true);
  };

  const handleCancelEdit = () => {
    setUpdatedMode(false);
    setFormData({
      name: contact.name,
      phone: contact.phone.toString(),
      email: contact.email,
      adress: contact.adress.toString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateContact = () => {
    const { name, phone, email, adress } = formData;
    const updatedContact = {
      ...contact,
      name,
      phone: parseInt(phone),
      email,
      adress: parseInt(adress),
    };

    fetch(`http://localhost:3333/contact/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    }).then((response) => {
      if (response.ok) {
        console.log("Contato atualizado com sucesso!");
        setContact(updatedContact);
        setUpdatedMode(false);
      } else {
        console.error("Erro ao atualizar contato:", response.statusText);
      }
    });
  };
  const handleDeleteContact = () => {
    fetch(`http://localhost:3333/contact/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        console.log("Contato deletado com sucesso!");
      } else {
        console.error("Erro ao deletar contato:", response.statusText);
      }
    });
  };

  return (
    <div>
      <h1>Detalhes do Contato</h1>
      {!updatedMode ? (
        <div className="detail-contact">
          <h4>ID: {contact.id}</h4>
          <h4>Nome: {contact.name}</h4>
          <h4>Telefone: {contact.phone}</h4>
          <h4>Email: {contact.email}</h4>
          <h4>Endereço: {contact.adress}</h4>
          <div className="detail-contact-btn">
            <button className="btn-update" onClick={handleEditClick}>
              <PiPenBold />
              Editar Contato
            </button>
            <button className="btn-delete" onClick={handleDeleteContact}>
              <BiTrash />
              Deletar Contato
            </button>
          </div>
        </div>
      ) : (
        <form className="input-contact">
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
          <div className="btn-actions">
            <button onClick={handleUpdateContact}>Salvar</button>
            <button onClick={handleCancelEdit}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
