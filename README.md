# hold-pic

a command line tool to download picture from [placeholder.com](https://placeholder.com/).

## Installation

You'll first need to install [hold-pic](https://github.com/AIluffy/hold):

```
# with npm
$ npm i -g hold-pic
# or with yarn
$ yarn global add hold-pic
```

## Usage

```shell
hold [options] <width> [height]
```

### see help

```shell
hold -h
```

![hold help](https://haitao.nos.netease.com/622a3dfc-cb28-4652-8e02-9d296e467d5f_1432_516.jpg)

### basic use

```shell
hold 100 110
```

![basic use](https://via.placeholder.com/100x110.jpg)

### set image gif extension

```shell
hold -g 100 / hold --gif 100
```

![hold gif](https://via.placeholder.com/100.gif)

### set image jpg extension

```shell
hold -j 100 / hold --jpg 100
```

![hold jpg](https://via.placeholder.com/100.jpg)


### set image jpeg extension

```shell
hold -J 100 / hold --jpeg 100
```

![hold jpeg](https://via.placeholder.com/100.jpeg)

### set image png extension

```shell
hold -p 100 / hold --png 100
```

![hold png](https://via.placeholder.com/100.png)

### set background color

```shell
hold -b ff0000 100 / hold --bg-color ff0000 100
```

![hold background red](https://via.placeholder.com/100.jpg/ff0000)

### set text color

```shell
hold -c ff0000 100 / hold -- color ff0000 100
```

![hold text red](https://via.placeholder.com/100.jpg//ff0000)

### set image custom text

```shell
hold 100 200 -t hello+world / hold 100 200 --text hello+world
```

![hold custom text](https://via.placeholder.com/100x200.jpg?text=hello+world)

### upload to nos

```shell
hold -u 100
```

![nos pic](https://haitao.nos.netease.com/aff07996-dd26-4642-a409-e357b2391e9d_100_100.jpg)