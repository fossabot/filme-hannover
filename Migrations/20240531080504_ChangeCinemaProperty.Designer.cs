﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using kinohannover.Data;

#nullable disable

namespace kinohannover.Migrations
{
    [DbContext(typeof(KinohannoverContext))]
    [Migration("20240531080504_ChangeCinemaProperty")]
    partial class ChangeCinemaProperty
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("NOCASE")
                .HasAnnotation("ProductVersion", "8.0.6");

            modelBuilder.Entity("CinemaMovie", b =>
                {
                    b.Property<int>("CinemasId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MoviesId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CinemasId", "MoviesId");

                    b.HasIndex("MoviesId");

                    b.ToTable("CinemaMovie");
                });

            modelBuilder.Entity("kinohannover.Models.Cinema", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("LinkToShop")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ReliableMetadata")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Website")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Cinema");
                });

            modelBuilder.Entity("kinohannover.Models.Movie", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Aliases")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .UseCollation("NOCASE");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("TEXT");

                    b.Property<string>("PosterUrl")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ReleaseDate")
                        .HasColumnType("TEXT");

                    b.Property<int?>("TmdbId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("TrailerUrl")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Movies");
                });

            modelBuilder.Entity("kinohannover.Models.ShowTime", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CinemaId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Language")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MovieId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ShopUrl")
                        .HasColumnType("TEXT");

                    b.Property<string>("SpecialEvent")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("TEXT");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CinemaId");

                    b.HasIndex("MovieId");

                    b.ToTable("ShowTime");
                });

            modelBuilder.Entity("CinemaMovie", b =>
                {
                    b.HasOne("kinohannover.Models.Cinema", null)
                        .WithMany()
                        .HasForeignKey("CinemasId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinohannover.Models.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("kinohannover.Models.ShowTime", b =>
                {
                    b.HasOne("kinohannover.Models.Cinema", "Cinema")
                        .WithMany("ShowTimes")
                        .HasForeignKey("CinemaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinohannover.Models.Movie", "Movie")
                        .WithMany("ShowTimes")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Cinema");

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("kinohannover.Models.Cinema", b =>
                {
                    b.Navigation("ShowTimes");
                });

            modelBuilder.Entity("kinohannover.Models.Movie", b =>
                {
                    b.Navigation("ShowTimes");
                });
#pragma warning restore 612, 618
        }
    }
}
