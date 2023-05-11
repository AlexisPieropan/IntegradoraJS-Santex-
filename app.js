// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = []; //productos en el carrito
        this.categorias = []; //categorias que se encuentran en el carrito 
    }


    

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);
        
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku); //RECIBE EL PRODUCTO DE LA PROMISE 
        
        console.log("Producto encontrado", producto);
        
        
        //------------------------------PUNTO N°1  a) y b) 
        // Creo un producto nuevo
        if(this.productos.find(element=>element.sku===sku)){     //DEBE ACTUALIZAR EL IMPORTE (SI EL SKU YA ESTA CARGADO EN PRODUCTOS)
            let indice=this.productos.findIndex((element => element.sku == sku));  //BUSCA EL INDICE DE DONDE ESTA ESE SKU PARA MODIFICAR ESE CASILLERO DEL ARRAY
            this.productos[indice].cantidad+=cantidad; //SE ACTUALIZA LA CANTIDAD
            this.precioTotal = this.precioTotal + (producto.precio * cantidad); //SE ACTUALIZA EL PRECIO TOTAL
            //console.log(this.productos);
        }else{                                                                              //SINO DEBE CREAR EL PRODUCTO CON NUEVO SKU EN EL CARRITO
        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad,producto.precio,producto.categoria);
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);
        this.categorias.push(producto.categoria);
        }

        
    }

    //-------------------------------------PUNTO N°2
    eliminarProducto(sku,cantidad) {
        
        return new Promise((resolve,reject)=>{  
            setTimeout( ()=>{
            const  produAEliminar =  this.productos.findIndex((element => element.sku == sku)); //recuperamos el indice del obj - devuelve -1 si no se encontro
          
            if(produAEliminar !== -1){
                if(this.productos[produAEliminar].cantidad > cantidad){                         //si la cantidad del carrito es mayor solo actualiza la cantidad 
                    this.productos[produAEliminar].cantidad -= cantidad
                    this.precioTotal -= (this.productos[produAEliminar].precio * cantidad);
                    resolve(`Se descontaron del stock del carrito el codigo ${sku}`)
                }else{                                                                          //sino si se elimina por completo un producto del carro se actualiza la categoria y el carrito
                    let arrCat=[]  //Varaible que tiene las categorias actualizadas
                    this.precioTotal -= (this.productos[produAEliminar].precio * cantidad);
                    const nuevoArr = this.productos.filter((element)=>element.sku !== sku )   //me filtra un array de obj sin ese sku 
                    
                    arrCat= nuevoArr.map((element)=>{
                        return element.categoria
                    })
                    
                    //SE ACTUALIZAN LOS PRODUCTOS EN CARRO Y LA CATEGORIA
                    this.productos=nuevoArr;
                    this.categorias=arrCat;                  
                    resolve(`Se ha actualizado el carrito se ha eliminando ${sku}`)
                }
            }else{
                reject(`NO SE ENCONTRO EL CODIGO ${sku}`);
            }
            },1600)
        })
    }
    

}


// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito
    precio;
    categoria;

    constructor(sku, nombre, cantidad,precio,categoria) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio =precio;
        this.categoria=categoria;
    }

}


// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);  //EJER N°1 pto C)
                console.log(`ERROR NO SE ENCONTRO EL PRODUCTO ${sku}`);
            }
        }, 1500);
    });
}


const carrito = new Carrito();


carrito.agregarProducto('WE328NJ', 3); //se agrega jabon
carrito.agregarProducto('FN312PPE', 3); //se agrega gaseosa

carrito.agregarProducto('XX92LKI', 2); //se agrega arroz
carrito.agregarProducto('XX92LKI', 2);
carrito.agregarProducto('XX92LKI', 2);

//Prueba de eliminar
carrito.eliminarProducto('FN312PPE', 3);

//prueba de eliminar con catch y then
carrito.eliminarProducto('XX92LKI', 6).then(msg=>console.log(msg)).catch(err=>console.log(err));


//----------------------------------------------------------------------------------
//PARA VISUALIZAR EL CARRITO
console.log(carrito);

