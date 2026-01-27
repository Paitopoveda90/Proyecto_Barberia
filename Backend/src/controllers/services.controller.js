const { Service } = require('../models');

// Obtener todos los servicios disponibles
exports.getAll = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicios', error: error.message });
  }
};

// Crear un nuevo servicio (solo admin)
exports.create = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({ message: 'Faltan campos requeridos: name, duration, price' });
    }

    // Obtener la URL de la imagen si se subió
    let imageUrl = null;
    if (req.file) {
      // Construir la URL de la imagen
      imageUrl = `/uploads/services/${req.file.filename}`;
    }

    const service = await Service.create({
      name,
      description: description || null,
      duration: parseInt(duration),
      price: parseFloat(price),
      image_url: imageUrl
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear servicio', error: error.message });
  }
};

// Actualizar un servicio existente (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (duration) service.duration = parseInt(duration);
    if (price) service.price = parseFloat(price);

    // Si se subió una nueva imagen, actualizar la URL
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      
      // Eliminar la imagen anterior si existe
      if (service.image_url) {
        const oldImagePath = path.join(__dirname, '../../', service.image_url);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkError) {
            console.warn('⚠️ No se pudo eliminar la imagen anterior:', unlinkError.message);
          }
        }
      }
      service.image_url = `/uploads/services/${req.file.filename}`;
    }

    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar servicio', error: error.message });
  }
};

// Eliminar servicio (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    // Eliminar la imagen asociada si existe
    if (service.image_url) {
      const imagePath = path.join(__dirname, '../../', service.image_url);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (unlinkError) {
          console.warn('⚠️ No se pudo eliminar la imagen:', unlinkError.message);
        }
      }
    }

    await service.destroy();
    res.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar servicio', error: error.message });
  }
};
