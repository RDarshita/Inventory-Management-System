package com.packerstech.controller;

import com.packerstech.dto.ItemRequest;
import com.packerstech.dto.ItemResponse;
import com.packerstech.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping("/party/{partyId}")
    public ResponseEntity<ItemResponse> createItem(@PathVariable Long partyId, @Valid @RequestBody ItemRequest request) {
        return new ResponseEntity<>(itemService.createItem(partyId, request), HttpStatus.CREATED);
    }

    @GetMapping("/party/{partyId}")
    public ResponseEntity<List<ItemResponse>> getItemsByParty(@PathVariable Long partyId) {
        return ResponseEntity.ok(itemService.getItemsByParty(partyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest request) {
        return ResponseEntity.ok(itemService.updateItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
