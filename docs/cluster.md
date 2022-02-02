# Pruebas de Cluster

Durante el siguiente archivo vamos a ver las pruebas realizadas con Cluster. Todos los test fueron realizados en Linux en un equipo con las siguientes especificaciones:

* **CPU:** Intel i5-8365U (8) @ 4.100GHz
* **GPU:** Intel WhiskeyLake-U GT2 [UHD Graphics 620]
* **Memory:** 15815MiB
* **Kernel:** 5.16.4-242-tkg-bmq
* **Shell:** zsh 5.8

## Ejecutando desde la terminal

Vamos a correr el proceso desde la terminal, y vamosa hacerlo desde el modo cluster o fork y para esto vamos a usar los comandos respectivamente:

```bash
npm start -- --modo=cluster
```

```bash
npm start -- --modo=fork
```

Y vamos a relaizar el chequeo desde la terminal de la siguiente manera (esto es solo funcional para linux y estoy utilizando un filtro especifico para node)

```bash
ps aux | grep /usr/bin/node
```

```bash
forever list
```

```bash
pm2 list
```

### Modo Cluster

```bash
pato      608010  7.0  0.7 11448144 113404 pts/0 Sl+  14:54   0:09 /usr/bin/node src/index.js --modo=cluster
pato      608042  9.8  0.6 11447620 111680 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608048  9.8  0.6 11447364 111672 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608054  9.6  0.6 11448308 109712 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608060  9.7  0.6 11447304 111396 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608066  9.8  0.6 11447852 110388 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608073 10.0  0.7 11447252 114600 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608080  9.7  0.6 11447756 111748 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
pato      608090  9.6  0.6 11447244 111244 pts/0 Sl+  14:54   0:12 /usr/bin/node /home/pato/Proyectos/filewriter/src/index.js --modo=cluster
```

### Modo Fork

```bash
pato      612411 82.6  0.6 11449584 112136 pts/0 Sl+  15:18   0:07 /usr/bin/node src/index.js --modo=fork
```

## Usando Forever

Usando forever podemos inicializalo con el siguiente comando 

```bash
forever src/index.js --modo=cluster
```

```bash
forever src/index.js --modo=fork
```

### Modo Cluster

```bash
info:    Forever processes running
data:undefined    uid  command       script                      forever pid    id logfile                      uptime                   
data:undefined[0] FT_m /usr/bin/node src/index.js --modo=cluster 622221  622243    /home/pato/.forever/FT_m.log 0:0:1:1.9110000000000014 
```

### Modo Fork

```bash
info:    Forever processes running
data:undefined    uid  command       script                                 forever pid    id logfile                      uptime       
data:undefined[0] lb2s /usr/bin/node src/index.js -c nodemon -- --modo=fork 621366  621378    /home/pato/.forever/lb2s.log 0:0:0:11.568 
```

## Usando PM2

Para usar PM2 lo vamos a hacer de la siguiente manera.

```bash
pm2 start src/index.js --name="CoderHouse" --watch -i max
```

```bash
pm2 start src/index.js --name="CoderHouse" --watch 
```

### Modo Cluster

```bash
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ CoderHouse         │ cluster  │ 7    │ online    │ 96.7%    │ 70.6mb   │
│ 1  │ CoderHouse         │ cluster  │ 7    │ online    │ 66.7%    │ 67.7mb   │
│ 2  │ CoderHouse         │ cluster  │ 5    │ online    │ 50%      │ 63.2mb   │
│ 3  │ CoderHouse         │ cluster  │ 5    │ online    │ 16.7%    │ 58.7mb   │
│ 4  │ CoderHouse         │ cluster  │ 3    │ online    │ 50%      │ 70.8mb   │
│ 5  │ CoderHouse         │ cluster  │ 3    │ online    │ 66.7%    │ 68.3mb   │
│ 6  │ CoderHouse         │ cluster  │ 3    │ online    │ 100%     │ 60.3mb   │
│ 7  │ CoderHouse         │ cluster  │ 3    │ online    │ 66.7%    │ 58.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### Modo Fork

```bash
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ CoderHouse         │ fork     │ 3    │ online    │ 100%     │ 79.2mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```