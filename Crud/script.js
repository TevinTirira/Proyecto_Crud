// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOpWQIOVhXZ9rDC19LRuMBE-gt8JYAejc",
  authDomain: "proyectocrud-6672f.firebaseapp.com",
  databaseURL: "https://proyectocrud-6672f-default-rtdb.firebaseio.com",
  projectId: "proyectocrud-6672f",
  storageBucket: "proyectocrud-6672f.firebasestorage.app",
  messagingSenderId: "991903636470",
  appId: "1:991903636470:web:f3b459ca893fd08dc285d7",
  measurementId: "G-BD9LS9G7T0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Función para agregar un producto a Firebase
function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const categoria = document.getElementById("categoria").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);

  // Validar datos
  if (nombre && categoria && !isNaN(precio) && !isNaN(stock)) {
    const newProductoRef = ref(db, 'productos/' + nombre);
    set(newProductoRef, {
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      stock: stock
    })
    .then(() => {
      alert("Producto agregado exitosamente");
      cargarProductos(); // Actualiza la lista de productos
    })
    .catch((error) => {
      console.error("Error al agregar el producto: ", error);
    });
  } else {
    alert("Por favor, complete todos los campos correctamente.");
  }
}

// Función para cargar y mostrar los productos
function cargarProductos() {
  const productosRef = ref(db, 'productos');
  get(productosRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const productos = snapshot.val();
        mostrarProductos(productos);
      } else {
        console.log("No hay productos disponibles.");
      }
    })
    .catch((error) => {
      console.error("Error al cargar los productos: ", error);
    });
}

// Función para mostrar los productos en la tabla
function mostrarProductos(productos) {
  const tablaProductos = document.getElementById('tablaProductos');
  tablaProductos.innerHTML = ''; // Limpiar tabla antes de mostrar los productos

  for (const key in productos) {
    if (productos.hasOwnProperty(key)) {
      const producto = productos[key];
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock}</td>
        <td>
          <button onclick="eliminarProducto('${producto.nombre}')">Eliminar</button>
          <button onclick="actualizarProducto('${producto.nombre}')">Actualizar</button>
        </td>
      `;
      tablaProductos.appendChild(fila);
    }
  }
}

// Función para eliminar un producto de Firebase
function eliminarProducto(nombre) {
  const productoRef = ref(db, 'productos/' + nombre);
  remove(productoRef)
    .then(() => {
      alert("Producto eliminado exitosamente");
      cargarProductos(); // Actualiza la lista de productos
    })
    .catch((error) => {
      console.error("Error al eliminar el producto: ", error);
    });
}

// Función para actualizar un producto
function actualizarProducto(nombreOriginal) {
  const nuevoNombre = prompt("Introduce el nuevo nombre del producto:", nombreOriginal);
  const nuevaCategoria = prompt("Introduce la nueva categoría del producto:");
  const nuevoPrecio = prompt("Introduce el nuevo precio del producto:");
  const nuevoStock = prompt("Introduce el nuevo stock del producto:");

  // Validar datos
  if (nuevoNombre && nuevaCategoria && !isNaN(parseFloat(nuevoPrecio)) && !isNaN(parseInt(nuevoStock))) {
    const productoRefOriginal = ref(db, 'productos/' + nombreOriginal);  // Referencia al producto original
    const productoRefNuevo = ref(db, 'productos/' + nuevoNombre);  // Nueva referencia

    if (nombreOriginal !== nuevoNombre) {
      // Si el nombre ha cambiado, elimina el producto original y crea uno nuevo con el nuevo nombre
      remove(productoRefOriginal)
        .then(() => {
          return set(productoRefNuevo, {
            nombre: nuevoNombre,
            categoria: nuevaCategoria,
            precio: parseFloat(nuevoPrecio),
            stock: parseInt(nuevoStock)
          });
        })
        .then(() => {
          alert("Producto actualizado exitosamente");
          cargarProductos(); // Actualiza la lista de productos
        })
        .catch((error) => {
          console.error("Error al actualizar el producto: ", error);
        });
    } else {
      // Si el nombre no ha cambiado, solo actualiza los datos del producto
      update(productoRefOriginal, {
        nombre: nuevoNombre,
        categoria: nuevaCategoria,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock)
      })
      .then(() => {
        alert("Producto actualizado exitosamente");
        cargarProductos(); // Actualiza la lista de productos
      })
      .catch((error) => {
        console.error("Error al actualizar el producto: ", error);
      });
    }
  } else {
    alert("Por favor, complete todos los campos correctamente.");
  }
}

// Exponer las funciones globalmente para poder acceder a ellas en el HTML
window.eliminarProducto = eliminarProducto;
window.actualizarProducto = actualizarProducto;

// Llamar a la función para cargar los productos al cargar la página
window.onload = cargarProductos;

// Agregar evento al formulario para agregar productos
document.getElementById("formAgregarProducto").addEventListener("submit", function(event) {
  event.preventDefault();  // Evita el envío tradicional del formulario
  agregarProducto();
});
