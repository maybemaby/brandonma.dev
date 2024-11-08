---
title: Getting Started with PostGIS using Go
publishedAt: 2024-11-07
previewText: PostGIS is a PostgreSQL extension that adds features for storing, indexing, and querying geospatial data. It's pretty nice that you can get these features in Postgres which is already a powerful database. I couldn't find much
metaDescription: Learn how to setup Go with PostGIS using pgx and go-geom.
---

# Getting Started with PostGIS using Go

## Table of Contents
- [Getting Started with PostGIS using Go](#getting-started-with-postgis-using-go)
	- [Table of Contents](#table-of-contents)
	- [Setting up PostGIS](#setting-up-postgis)
	- [Setting up the Go project](#setting-up-the-go-project)
	- [The Scenario](#the-scenario)
		- [Creating the tables](#creating-the-tables)
		- [Representing the data in Go](#representing-the-data-in-go)
		- [Adding geometry encoding support to pgx](#adding-geometry-encoding-support-to-pgx)
		- [Inserting data](#inserting-data)
		- [Querying data](#querying-data)
	- [Wrapping up](#wrapping-up)


PostGIS is a PostgreSQL extension that adds features for storing, indexing, and querying geospatial data.
It's pretty nice that you can get these features in Postgres which is already a powerful database. I couldn't
find much info available on how to integrate this with Go and the [pgx](https://github.com/jackc/pgx) package, so I decided to write this guide.

*Disclaimer: I am not a GIS expert, so I might miss important points about properly storing and indexing
geospatial data. This post will just cover examples to get started.*

## Setting up PostGIS
For this example, I'll use Docker to bootstrap PostGIS. You can also follow [their documentation](https://postgis.net/documentation/getting_started/) if you want to
install it another way.

```bash
docker run --name postgis-go -e POSTGRES_PASSWORD=postgres \
-e POSTGRES_USER=postgres -e POSTGRES_DB=gopg \
-p 5432:5432 -d  postgis/postgis
```

## Setting up the Go project
Create a new Go project or use an existing one. Install the following dependencies:

```bash
go get -u github.com/jackc/pgx/v5 github.com/twpayne/go-geom github.com/twpayne/pgx-geom
```

- pgx is a popular PostgreSQL driver for Go.
- go-geom is a pure Go package for geometry types.
- pgx-geom was written by the same author of go-geom and provides a convenient way to encode and decode PostGIS geometries to Go types.

## The Scenario
To keep it practical, let's imagine an application where you want to let the users save their favorite places on a map.
They can also save travel routes and pull up locations near this route.

To represent locations and routes, you'll need to select an appropriate geometry type.
[PostGIS provides several geometry types](https://postgis.net/docs/manual-3.5/using_postgis_dbmanagement.html#RefObject), we'll be using `POINT`
and `LINESTRING`.

`POINT` represents a single point in space, such as a place on the Earth. We'll use it for the locations.
`LINESTRING` represents a 1-dimensional line composed of multiple line segments. Each segment has two points, with the end point being the start
of the next segment. We'll use it for the routes.

![Depiction of a POINT vs LINESTRING](/point-v-linestring.webp)

### Creating the tables

```go
package main

import (
	"context"

	"github.com/jackc/pgx/v5"
)

const pgConnStr = "postgres://postgres:postgres@localhost:5432/gopg?sslmode=disable"

func main() {
	ctx := context.Background()

	db, err := pgx.Connect(ctx, pgConnStr)

	if err != nil {
		panic(err)
	}

	defer db.Close(ctx)

	// Scaffold tables
	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS favorite_places (
			id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			name TEXT NOT NULL,
			coordinates geography(POINT, 4326) NOT NULL
		)
		`)

	db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS routes (
			id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			path geography(LINESTRING, 4326) NOT NULL
		)
		`)
}
```

It's worth noting PostGIS has two geometry types: geography and geometry.
The docs recommend using geography to represent geographic coordinates in the
form of longitude and latitude. Instead of using straight lines in calculations, it
uses arcs which is more appropriate for the Earth's surface.

We define a geometric column using this syntax:
```
column_name <abstract-type>(<concrete-type>, <SRID>)
```
where abstract-type is either `geometry` or `geography`, concrete-type is the specific type such as POINT or LINESTRING,
and [SRID](https://en.wikipedia.org/wiki/Spatial_reference_system) is the Spatial Reference Identifier.

### Representing the data in Go

```go
// "github.com/twpayne/go-geom"
type FavoritePlace struct {
	ID          int
	Name        string
	Coordinates geom.Point
}

type Route struct {
	ID   int
	Path geom.LineString
}
```

You can declare points and linestrings like so:

```go
// geom.Coord is a type alias for []float64

// Specify the use of 2D coordinates, set the SRID to 4326, and pass in the coordinates
pt := geom.NewPoint(geom.XY).SetSRID(4326).MustSetCoords(geom.Coord{45.52515498907135, -73.57520521798992})

// Linestring with 3 segments
line := geom.NewLineString(geom.XY).SetSRID(4326).MustSetCoords([]geom.Coord{
	{45.52515498907135, -73.57520521798992},
	{45.52433716241833, -73.57591484495788},
	{45.523244861127694, -73.57358389203318},
	{45.52071221016285, -73.57593660297117},
})
```

### Adding geometry encoding support to pgx

In order for pgx to be able to encode and decode the types from go-geom, we need
to register the types with pgx.

```go
// pgxgeom "github.com/twpayne/pgx-geom"

pgxgeom.Register(ctx, db)
```

If you don't do this you'll get an error like this:
```
panic: failed to encode args[1]: unable to encode geom.Point{geom0:geom.geom0{layout:1, stride:2, flatCoords:[]float64{45.52516207479769, -73.57524302609725}, srid:4326}} into text format for unknown type (OID 18755): cannot find encode plan
```


### Inserting data

```go
favPlaces := []FavoritePlace{
	{
		Name:        "Ma Poule Mouillée",
		Coordinates: *geom.NewPoint(geom.XY).SetSRID(4326).MustSetCoords(geom.Coord{-73.57524302609725, 45.52516207479769}),
	},
	{
		Name:        "St-Viateur Bagel",
		Coordinates: *geom.NewPoint(geom.XY).SetSRID(4326).MustSetCoords(geom.Coord{-73.60198850368204, 45.52282543077195}),
	},
	{
		Name:        "Kem CoBa",
		Coordinates: *geom.NewPoint(geom.XY).SetSRID(4326).MustSetCoords(geom.Coord{-73.59518469669553, 45.52309288029339}),
	},
}

for _, favPlace := range favPlaces {
	_, err = db.Exec(ctx, "INSERT INTO favorite_places (name, coordinates) VALUES ($1, $2)", favPlace.Name, &favPlace.Coordinates)
	if err != nil {
		panic(err)
	}
}

route := Route{
Path: *geom.NewLineString(geom.XY).SetSRID(4326).MustSetCoords([]geom.Coord{
		{-73.60189653194972, 45.52253964921602},
		{-73.59978123333241, 45.524969604538974},
		{-73.59533615511437, 45.522942689508255},
	}),
}

_, err = db.Exec(ctx, "INSERT INTO routes (path) VALUES ($1)", &route.Path)

if err != nil {
	panic(err)
}
```

If you look at your database, you should see the data has been inserted.
The geometry types will look like this:

```
SRID=4326;POINT(-73.57524302609725 45.52516207479769)
SRID=4326;LINESTRING(-73.60189653194972 45.52253964921602,-73.59978123333241 45.52496960453897,-73.59533615511437 45.52496960453897)
```

This format for geometry is known as EWKT (Extended Well-Known-Text). It's nice because
it's human-readable and includes SRID, but depending on the application you may have reasons to use other formats.
PostGIS supports input and output of various formats including:

- WKT (Well-Known Text)
- GeoJSON
- WKB (Well-Known Binary)
- EWKB (Extended Well-Known Binary)
- [And more](https://postgis.net/docs/manual-3.5/reference.html#Geometry_Inputs)

### Querying data

Now let's implement the query to find favorite places within a certain distance of a given route.

```go
func findClosest(ctx context.Context, db *pgx.Conn, routeId int, distanceMeters float64) ([]FavoritePlace, error) {
	rows, err := db.Query(ctx, `
		SELECT * FROM favorite_places
		WHERE ST_DISTANCE((
			SELECT path FROM routes WHERE routes.id = $1
		), coordinates) < $2
		`, routeId, distanceMeters)

	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[FavoritePlace])
}
```

The important part here is the `ST_DISTANCE` function. This function calculates the distance between the two geometries passed as arguments and
let's us filter the results based on that distance. With that, we can add the following code:

```go
// Find favorite places within 100 meters of route with ID 1
favPlaces, err = findClosest(ctx, db, 1, 100.0)

if err != nil {
	panic(err)
}

for _, favPlace := range favPlaces {
	fmt.Printf("%s at %f, %f\n", favPlace.Name, favPlace.Coordinates.X(), favPlace.Coordinates.Y())
}

// Output:
// St-Viateur Bagel at -73.601989, 45.522825
// Kem CoBa at -73.595185, 45.523093
```

You should see that only St-Viateur and Kem CoBa are returned, as Ma Poule Mouillée is farther than 100 meters from the route. You can also see that it decoded the coordinates column as a `geom.Point` type.

## Wrapping up

That covers the basics of integrating your Go code with PostGIS. There's a
lot more you can do with PostGIS, but hopefully this is enough to get you started.
